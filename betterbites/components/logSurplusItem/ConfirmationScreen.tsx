"use client";
import styles from "./LogSurplusForm.module.css";
export default function ConfirmationScreen({
    data,
    onClose,
    }: {
    data: {item: string; quantity: string; expDate: string; category: string };
    onClose: () => void;
    }) {
    return (
        <div
            className={styles.confirmation_overlay}
            onClick={onClose}
        >
        <div
            className={styles.confirmation_container}
            onClick={(e) => e.stopPropagation()}>

        <h2
            className={styles.success_header}>
          Surplus Item Logged Successfully!
        </h2>

        <p
            className={styles.success_messager}>
            Your item has been recorded and is ready for donation.
        </p>

        {/* Item summary */}
        <div
            className={styles.item_display_container}>
            <p className={styles.item_display_text}>
                <strong>Item:</strong> {data.item} items
            </p>

            <p className={styles.item_display_text}>
                <strong>Quantity:</strong> {data.quantity} items
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
          className={styles.close_button}>
          Done
        </button>
      </div>
    </div>
  );
}
