import renderText from '../helpers/renderText';
import NotionImage from './NotionImage';

const SectionSub = ({ type, subsection, i }) => {
  const types = {
    image: () => (
      <span className={`image ${i === 0 ? 'fill' : 'main'}`}>
        <NotionImage src={subsection.src} />
      </span>
    ),
    text: () => i !== 0 && <p>{renderText(subsection.value)}</p>,
    list: () =>
      i !== 0 && (
        <ul>
          {subsection.children.map((child, k) => (
            <li key={k}>{renderText(child)}</li>
          ))}
        </ul>
      )
  };

  if (types.hasOwnProperty(type)) return types[type]();
  else return null;
};

export default SectionSub;
