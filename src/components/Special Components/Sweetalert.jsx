import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import "./Sweetalert.css";

export default function Sweetalert(title, text, icon, buttonText,status) {
  return Swal.fire({
    // title: title,
    text: text,
    icon: icon,
    confirmButtonText: buttonText,
    showCancelButton: status,
    cancelButtonText: "Cancel",
  });
}
