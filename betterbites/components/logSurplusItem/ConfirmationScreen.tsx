"use client";
import styles from "./LogSurplusForm.module.css";

//type error fix for vercek
type SubmissionData = {
  item: string;
  quantity: number;
  expDate: string;
  category: string;
};

type ConfirmationScreenProps = {
  data: SubmissionData;
  onClose: () => void;
};

export default function ConfirmationScreen({
  data,
  onClose,
}: ConfirmationScreenProps) {
  return (
    <div
      className={styles.confirmation_overlay}
      onClick={onClose}
    >
      <div
    className={styles.confirmation_container}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.success_header}>
          Surplus Item Logged Successfully!
        </h2>

        <p className={styles.success_messager}>
          Your item has been recorded and is ready for donation.
        </p>

      
        <div className={styles.item_display_container}>
          <p className={styles.item_display_text}>
            <strong>Item:</strong> {data.item}
          </p>

          <p className={styles.item_display_text}>
            <strong>Quantity:</strong> {data.quantity}
          </p>

          <p className={styles.item_display_text}>
            <strong>Expiration:</strong> {data.expDate}
          </p>

          {data.category && (
            <p className={styles.item_display_text}>
              <strong>Category:</strong> {data.category}
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className={styles.close_button}
        >
          Done
        </button>
      </div>
    </div>
  );
}
