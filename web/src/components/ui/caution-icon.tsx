
type CautionIconProps = {
  color?: string;
}

const CautionIcon: React.FC<CautionIconProps> = ({ 
  color = "currentColor" 
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" 
      strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info size-3" aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 16v-4"></path>
      <path d="M12 8h.01"></path>
    </svg>
  );
}

export default CautionIcon;
