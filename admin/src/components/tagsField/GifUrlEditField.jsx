import { useRecordContext } from "react-admin";
import { useLocation } from "react-router-dom";

const GifUrlEditField = () => {
  const obj = useRecordContext();
  let location = useLocation();

  const removeImage = async () => {
    try {
      const resource =
        location.pathname.indexOf("collection") >= 0 ? "collection" : "clothes";
      const request = new Request(`api/${resource}/image/delete`, {
        method: "DELETE",
        body: JSON.stringify({
          _id: obj.id,
          url: obj.gifUrl,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      await fetch(request);
    } catch (e) {
      throw new Error("Opps! Something went wrong!");
    }
  };

  return (
    obj.gifUrl && (
      <div>
        <img
          style={{ width: "100px", height: "100px" }}
          src={obj.gifUrl}
          alt={"gifUrl"}
          key={obj.gifUrl}
        />
        <button onClick={removeImage}>delete</button>
      </div>
    )
  );
};

export default GifUrlEditField;
