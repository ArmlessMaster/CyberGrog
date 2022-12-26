import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  required,
  ArrayInput,
  SimpleFormIterator,
  DateInput,
} from "react-admin";
import { usePermissions } from "react-admin";

const AccountEdit = (props) => {
  const { permissions } = usePermissions();
  return permissions === "Admin" ? (
    <Edit {...props} undoable="false" mutationMode="pessimistic">
      <SimpleForm>
        <TextInput fullWidth disabled source="id" />
        <TextInput fullWidth disabled source="email" />
        <TextInput fullWidth disabled source="nickname" />
        <TextInput fullWidth disabled source="region" />
        <SelectInput
          source="role"
          validate={required()}
          choices={[
            { id: "Admin", name: "Admin" },
            { id: "Moderator", name: "Moderator" },
            { id: "User", name: "User" },
          ]}
        />
        <DateInput source="subscribeTime" disabled helperText={false} />
      </SimpleForm>
    </Edit>
  ) : permissions === "Moderator" ? (
    <Edit {...props} undoable="false" mutationMode="pessimistic">
      <SimpleForm>
        <TextInput fullWidth disabled source="id" />
        <TextInput fullWidth disabled source="email" />
        <TextInput fullWidth disabled source="nickname" />
        <TextInput fullWidth disabled source="region" />
      </SimpleForm>
    </Edit>
  ) : (
    <div>No access</div>
  );
};
export default AccountEdit;