import { useRecordContext } from "react-admin";

const ImagesUrlsField = () => {
  const obj = useRecordContext();
  return (
    <ul>
      {obj.imagesUrls.map((item) => {
        return item && (<img
          style={{ width: "100px", height: "100px" }}
          src={item}
          alt={"imagesUrls"}
          key={item}
        />);
      })}
    </ul>
  );
};

export default ImagesUrlsField;
