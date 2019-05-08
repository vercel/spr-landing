import SectionSub from './SectionSub'

const SectionContent = ({ section, i }) => (
  <div className="content">
    {section.children.map((subsection, j) => (
      <SectionSub key={j} type={subsection.type} {...{ subsection, i }} />
    ))}
  </div>
);

export default SectionContent;
