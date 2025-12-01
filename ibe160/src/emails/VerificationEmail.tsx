import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface VerificationEmailProps {
  validationUrl: string;
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const box = {
  padding: '0 48px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const paragraph = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
};

const button = {
  backgroundColor: '#61dafb', // React Blue
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '10px',
};

const anchor = {
  color: '#61dafb',
};

export const VerificationEmail = ({ validationUrl }: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Email Verification</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={paragraph}>Hello,</Text>
          <Text style={paragraph}>
            Thank you for registering. Please click the button below to verify your email address.
          </Text>
          <Button style={button} href={validationUrl}>
            Verify your email
          </Button>
          <Text style={paragraph}>
            If you did not request this, please ignore this email.
          </Text>
          <hr style={hr} />
          <Text style={paragraph}>
            If the button above does not work, please copy and paste the following link into your browser:
          </Text>
          <Link style={anchor} href={validationUrl}>
            {validationUrl}
          </Link>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmail;
