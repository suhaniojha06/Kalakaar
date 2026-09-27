from sqlalchemy.orm import Session as DbSession

from auth import hash_password
from models.post import Post
from models.user import User

DEFAULT_NAME = "Ram Charan"
DEFAULT_PASSWORD = "kalakaar"

DEFAULT_POSTS = [
    {
        "title": "GI Hand-Block Machilipatnam Kalamkari Natural Silk Fabric",
        "content": (
            "Washed in the flowing waters of Krishna river, treated with milk and "
            "myrobalan nuts, and block-printed by master artisan Ram Charan in Pedana cluster."
        ),
        "category": "Kalamkari Heritage",
        "status": "exported",
        "image_url": "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=900&q=95",
        "price": 2450,
    },
    {
        "title": "Natural Terracotta Clay Earthenware Handi",
        "content": "Hand-thrown terracotta cookware from the artisan's workshop.",
        "category": "Earthen Pottery",
        "status": "exported",
        "image_url": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=95",
        "price": 750,
    },
    {
        "title": "Jaipur Handcrafted Blue Pottery Floral Table Vase",
        "content": "Draft catalog listing for a blue pottery vase.",
        "category": "Blue Pottery",
        "status": "draft",
        "image_url": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=80",
        "price": 1250,
    },
]


def seed_default_account(db: DbSession) -> None:
    existing = db.query(User).filter(User.is_default.is_(True)).first()
    if existing is not None:
        return

    user = User(
        name=DEFAULT_NAME,
        password_hash=hash_password(DEFAULT_PASSWORD),
        location="Machilipatnam, Andhra Pradesh",
        cluster="Kalamkari Cluster, AP",
        avatar_url="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
        verified=True,
        is_default=True,
    )
    db.add(user)
    db.flush()

    for post in DEFAULT_POSTS:
        db.add(Post(user_id=user.id, **post))

    db.commit()
