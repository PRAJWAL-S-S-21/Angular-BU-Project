import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface FormField {
  name: string;
  label: string;
  type: string;
  show: boolean;
  required: boolean;
  order: number;
  icon?: IconDefinition;  // ✅ Change string to IconDefinition
}
