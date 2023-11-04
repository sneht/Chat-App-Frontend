import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import * as React from "react";

export const DeleteChatModal = ({
  open,
  onClose,
  handleDeleteMessage,
  isLoading,
}) => {
  // const [progress, setProgress] = React.useState(0);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress((prevProgress) =>
  //       prevProgress >= 100 ? 0 : prevProgress + 10
  //     );
  //   }, 800);

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="draggable-dialog-title"
      >
        <div class="ps-4  pt-4 sm:p-6 flex items-center justify-between border-b border-black/10 dark:border-white/10">
          <div class="flex">
            <div class="flex items-center">
              <div class="flex flex-col gap-1 sm:text-left">
                <h2
                  id="radix-:r37:"
                  as="h3"
                  class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200"
                >
                  Delete chat?
                </h2>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <DialogContent>
          <DialogContentText sx={{ color: "white" }}>
            Are you sure you want to delete this message ?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: "1rem" }}>
          <Button autoFocus onClick={onClose} className="cancel-btn">
            Cancel
          </Button>
          <Button onClick={() => handleDeleteMessage()} className="delete-btn">
            {isLoading ? (
              <CircularProgress
                color="inherit"
                style={{ height: "25px", width: "25px" }}
              />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
