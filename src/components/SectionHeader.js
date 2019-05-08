import renderText from '../helpers/renderText';

const SectionHeader = ({ section, i }) => (
  <header>
    {i === 0 ? (
      <>
        <h1>{renderText(section.title)}</h1>
        {section.children[0] && section.children[0].type === 'text' ? (
          <p>{renderText(section.children[0].value)}</p>
        ) : null}
        <ul className="actions">
          <li>
            <a href="#first" className="arrow scrolly">
              <span className="label">Next</span>
            </a>
          </li>
        </ul>
      </>
    ) : (
      <h2>{renderText(section.title)}</h2>
    )}
  </header>
);

export default SectionHeader;
