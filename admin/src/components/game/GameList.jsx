import React from "react";
import { usePermissions } from "react-admin";
import { List, Datagrid, TextField, DeleteButton } from "react-admin";

const ClothesList = (props) => {
  const { permissions } = usePermissions();

  return permissions === "Admin" || permissions === "Moderator" ? (
    <List {...props} pagination={false}>
      <Datagrid bulkActionButtons={false}>
        <TextField sortable={false} source="id" />
        <TextField source="gameId" helperText={false} />
        <TextField source="createdAt" helperText={false} />
        <TextField source="updatedAt" helperText={false} />
        <DeleteButton undoable="false" mutationMode="pessimistic" />;
      </Datagrid>
    </List>
  ) : (
    <div>No access</div>
  );
};

export default ClothesList;