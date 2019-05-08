import SectionHeader from './SectionHeader';
import SectionContent from './SectionContent';

const Section = ({ section, i }) => (
  <section className={i === 0 ? 'intro' : ''} id={i === 1 ? 'first' : ''}>
    <SectionHeader {...{ section, i }} />
    <SectionContent {...{ section, i }} />
  </section>
);

export default Section;
