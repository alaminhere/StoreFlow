const SectionBar = ({
  className,
  title,
  description,
}: {
  className?: string;
  title: string;
  description: string;
}) => {
  return (
    <div className={` ${className}`}>
      <h2> {title} </h2>
      <p> {description}</p>
    </div>
  );
};

export default SectionBar;
