export type AppTab = 'studio' | 'history';

export type WizardStep = 1 | 2 | 3 | 4;

export interface WizardStepInfo {
  step: WizardStep;
  iconName: string;
  titleKey: string;
  subtitleKey: string;
}
