export default function PawnIcon(color: string) {
  return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="10" cy="3.5" r="3.15" fill=${color} stroke="black" stroke-width="0.7"/>
<rect x="3.85" y="17.85" width="12.3" height="1.8" rx="0.9" fill=${color} stroke="black" stroke-width="0.7"/>
<path d="M7.50872 11.1099L7.82205 7.35H12.178L12.4913 11.1099C12.6006 12.4221 12.9593 13.7013 13.5482 14.879L13.9337 15.65H6.06631L6.4518 14.879C7.04065 13.7013 7.39937 12.4221 7.50872 11.1099Z" fill=${color} stroke="black" stroke-width="0.7"/>
<rect x="4.35" y="15.85" width="11.3" height="1.8" rx="0.9" fill=${color} stroke="black" stroke-width="0.7"/>
<rect x="5.85" y="5.85" width="8.3" height="1.8" rx="0.9" fill=${color} stroke="black" stroke-width="0.7"/>
</svg>
`;
}
