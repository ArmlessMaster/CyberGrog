import { useRecordContext } from "react-admin";
import { useLocation } from 'react-router-dom';

const ImagesUrlsEditField = () => {
  const obj = useRecordContext();
  let location = useLocation();
  const removeImage = async (event) => {
    try {
      const resource = location.pathname.indexOf("collection") >= 0 ? "collection" : "clothes";
      const request = new Request(`api/${resource}/image/delete`, {
        method: "DELETE",
        body: JSON.stringify({
            _id: obj.id,
            url: event.target.name,
          }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },       
      });
      await fetch(request);
    } catch (e) {
      throw new Error("Opps! Something went wrong!");
    }
  };

  return (
    <ul>
      {obj.imagesUrls.map((item) => {
        return (
          item && (
            <div >
              <img
                style={{ width: "100px", height: "100px" }}
                src={item}
                alt={"imagesUrls"}
                key={item}
              />
              <button name={item} onClick={removeImage}>delete</button>
            </div>
          )
        );
      })}
    </ul>
  );
};

export default ImagesUrlsEditField;
