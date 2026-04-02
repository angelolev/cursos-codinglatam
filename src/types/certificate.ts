export interface CertificateProps {
  id: string;
  code: string;
  studentName: string;
  courseName: string;
  completionDate: string;
  certificateUrl?: string;
  isValid: boolean;
}
