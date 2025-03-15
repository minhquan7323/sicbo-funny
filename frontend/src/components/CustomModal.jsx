import { Modal, Box, Typography } from "@mui/material"

const CustomModal = ({ open, handleClose, title, children, actions }) => {
    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography id="modal-title" variant="h6" component="h2">
                    {title}
                </Typography>
                <Box mt={2}>{children}</Box>
                <Box mt={2} sx={{ display: "flex", justifyContent: "space-between" }}>
                    {actions}
                </Box>
            </Box>
        </Modal>
    )
}

export default CustomModal
