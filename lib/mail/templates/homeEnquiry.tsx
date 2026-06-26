import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Hr,
  Section,
  Row,
  Column,
} from "@react-email/components";
import { ReactElement } from "react";

export type HomeEnquiryEmailProps = {
  firstName: string;
  forCompany: string;
  email: string;
  phone: string;
  details?: string;
};

export function HomeEnquiryEmail({
  firstName,
  forCompany,
  email,
  phone,
  details,
}: HomeEnquiryEmailProps): ReactElement {
  return (
    <Html>
      <Head />
      <Preview>New enquiry from {firstName}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>

          {/* Header */}
          <Section style={styles.header}>
            <Text style={styles.headerLabel}>NEW ENQUIRY</Text>
            <Text style={styles.headerTitle}>Someone wants to connect</Text>
          </Section>

          {/* Fields */}
          <Section style={styles.content}>
            <Field label="Name" value={firstName} />
            <Field label="Company" value={forCompany || "—"} />
            <Field label="Email" value={email} />
            <Field label="Phone" value={phone} />
            {details && <Field label="Details" value={details} last />}
          </Section>

          <Hr style={styles.hr} />

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} Neuro Vanta. All rights reserved.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

function Field({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <Row style={{ marginBottom: last ? 0 : 20 }}>
      <Column>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldValue}>{value}</Text>
      </Column>
    </Row>
  );
}

const styles = {
  body: {
    backgroundColor: "#f0f0f0",
    margin: 0,
    padding: "40px 0",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    maxWidth: "560px",
    margin: "0 auto",
    borderRadius: "12px",
    overflow: "hidden" as const,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
  header: {
    backgroundColor: "#0a0a0a",
    padding: "36px 40px",
  },
  headerLabel: {
    color: "#888888",
    fontSize: "11px",
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    margin: "0 0 8px",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "600",
    margin: 0,
  },
  content: {
    padding: "36px 40px",
  },
  fieldLabel: {
    color: "#999999",
    fontSize: "11px",
    letterSpacing: "1.5px",
    textTransform: "uppercase" as const,
    margin: "0 0 4px",
  },
  fieldValue: {
    color: "#111111",
    fontSize: "15px",
    margin: 0,
  },
  hr: {
    borderColor: "#eeeeee",
    margin: "0 40px",
  },
  footer: {
    padding: "24px 40px",
  },
  footerText: {
    color: "#bbbbbb",
    fontSize: "12px",
    margin: 0,
    textAlign: "center" as const,
  },
};