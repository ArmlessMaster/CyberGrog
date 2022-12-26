import { useRecordContext } from "react-admin";

const GifUrlField = () => {
  const obj = useRecordContext();

  return obj.gifUrl ? (
    <div>
      <img
        style={{width: '100px', height: '100px'}}
        src={obj.gifUrl}
        alt={"gifUrl"}
        key={obj.gifUrl}
      />
    </div>
  ) : <div></div>;
};

export default GifUrlField;
