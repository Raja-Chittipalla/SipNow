import { useScrollReveal } from "../hooks/useScrollReveal.js";

export default function Reveal({
  as: Tag = "section",
  className = "",
  id,
  children,
}) {
  const ref = useScrollReveal();
  return (
    <Tag ref={ref} id={id} className={`reveal-on-scroll ${className}`}>
      {children}
    </Tag>
  );
}
