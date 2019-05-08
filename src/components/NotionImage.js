const NotionImage = ({ src }) => {
  if (src) {
    return <img title="image" src={src} />;
  } else {
    return <div />;
  }
};

export default NotionImage;
