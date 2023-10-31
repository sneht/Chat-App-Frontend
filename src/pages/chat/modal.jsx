import React from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Grid,
  Modal,
  TextField,
} from "@mui/material";

const ModalForAddEdit = ({
  show,
  style,
  formik,
  usersList,
  handleCloseModal,
  isEdit,
  isAdd,
}) => {
  return (
    <Modal
      open={show}
      onClose={() => handleCloseModal()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        component="form"
        sx={style}
        onSubmit={formik.handleSubmit}
        borderRadius={"7px"}
      >
        <Grid item xs={12} padding={"12px"}>
          <TextField
            name="group_name"
            label="Group Name"
            fullWidth
            autoFocus
            {...formik.getFieldProps("group_name")}
          />
          {formik.touched.group_name && formik.errors.group_name && (
            <Alert
              severity="error"
              sx={{ backgroundColor: "transparent", color: "rgb(245 4 0)" }}
            >
              {formik.errors.group_name}
            </Alert>
          )}
        </Grid>
        <Autocomplete
          name="users"
          id="users"
          multiple
          disablePortal
          sx={{ padding: "12px" }}
          options={usersList}
          getOptionLabel={(option) => option.fullname}
          getOptionValue={(option) => option._id}
          value={formik.values.users || []}
          onChange={(event, newValue) => {
            const selectedIds = newValue.map((option) => option);
            formik.setFieldValue("users", selectedIds);
          }}
          renderInput={(params) => {
            return <TextField {...params} label="Users" />;
          }}
          renderTags={(value, getTagProps) =>
            (value || []).map((option, index) => {
              return (
                <Chip
                  label={option ? option.fullname : "Name not available"}
                  {...getTagProps({ index })}
                  onDelete={() => {
                    const newUsers = [...formik.values.users];
                    newUsers.splice(index, 1);
                    formik.setFieldValue("users", newUsers);
                  }}
                />
              );
            })
          }
        />
        {formik.touched.users && formik.errors.users && (
          <Alert
            severity="error"
            sx={{ backgroundColor: "transparent", color: "rgb(245 4 0)" }}
          >
            {formik.errors.users}
          </Alert>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 1, mb: 2, p: "12px" }}
        >
          {(isEdit && "Edit Group") || (isAdd && "Create Group")}
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalForAddEdit;
