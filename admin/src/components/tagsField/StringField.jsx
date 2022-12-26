import { useRecordContext } from 'react-admin';


const StringField = () => {
    const obj = useRecordContext();
    return (
        <ul>
            {obj.color.map(item => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    )
};

export default StringField;