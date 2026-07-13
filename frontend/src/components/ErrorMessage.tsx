interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div style={errorStyle}>
      <strong>❌ Error:</strong> {message}
    </div>
  );
}

const errorStyle: React.CSSProperties = {
  backgroundColor: '#fee2e2',
  color: '#991b1b',
  padding: '1rem',
  borderRadius: '8px',
  border: '1px solid #fecaca',
  marginBottom: '1rem'
};
