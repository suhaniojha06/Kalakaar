from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session as DbSession

from auth import CurrentUser, create_session, get_user_by_name, hash_password, verify_password
from database import Base, SessionLocal, engine, get_db
from models.post import Post
from models.session import Session
from models.user import User
from schemas import AuthResponse, Credentials, PostCreate, PostOut, PostUpdate, ProfileOut
from seed import seed_default_account


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_default_account(db)
    finally:
        db.close()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="Kalakaar Auth",
    description="Local name/password auth with per-user posts stored in SQLite.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()


def _auth_payload(db: DbSession, user: User) -> AuthResponse:
    return AuthResponse(token=create_session(db, user), profile=ProfileOut.model_validate(user))


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/auth/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(body: Credentials, db: DbSession = Depends(get_db)):
    name = body.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Name is required")
    if get_user_by_name(db, name):
        raise HTTPException(status_code=409, detail="That name is already taken")

    user = User(
        name=name,
        password_hash=hash_password(body.password),
        location="",
        cluster="",
        avatar_url="",
        verified=False,
        is_default=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return _auth_payload(db, user)


@app.post("/auth/login", response_model=AuthResponse)
def login(body: Credentials, db: DbSession = Depends(get_db)):
    user = get_user_by_name(db, body.name)
    if user is None or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect name or password")
    return _auth_payload(db, user)


@app.post("/auth/logout")
def logout(user: CurrentUser, db: DbSession = Depends(get_db)):
    db.query(Session).filter(Session.user_id == user.id).delete()
    db.commit()
    return {"ok": True}


@app.get("/auth/me", response_model=ProfileOut)
def current_profile(user: CurrentUser):
    return user


@app.get("/posts", response_model=list[PostOut])
def list_posts(user: CurrentUser, db: DbSession = Depends(get_db)):
    return (
        db.query(Post)
        .filter(Post.user_id == user.id)
        .order_by(Post.created_at.desc())
        .all()
    )


@app.post("/posts", response_model=PostOut, status_code=status.HTTP_201_CREATED)
def create_post(body: PostCreate, user: CurrentUser, db: DbSession = Depends(get_db)):
    post = Post(user_id=user.id, **body.model_dump())
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@app.get("/posts/{post_id}", response_model=PostOut)
def get_post(post_id: int, user: CurrentUser, db: DbSession = Depends(get_db)):
    post = db.get(Post, post_id)
    if post is None or post.user_id != user.id:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@app.patch("/posts/{post_id}", response_model=PostOut)
def update_post(post_id: int, body: PostUpdate, user: CurrentUser, db: DbSession = Depends(get_db)):
    post = db.get(Post, post_id)
    if post is None or post.user_id != user.id:
        raise HTTPException(status_code=404, detail="Post not found")

    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(post, field, value)

    db.commit()
    db.refresh(post)
    return post


@app.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(post_id: int, user: CurrentUser, db: DbSession = Depends(get_db)):
    post = db.get(Post, post_id)
    if post is None or post.user_id != user.id:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    db.commit()
