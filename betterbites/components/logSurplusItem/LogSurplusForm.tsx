//statement defined to run on client side (default runs on server)
"use client";

import ConfirmationScreen from "./ConfirmationScreen"
import React, {useState, useEffect, FormEvent} from "react";
import styles from "./LogSurplusForm.module.css";

//added this ti avoid the type error we were gettgin at deployment
type SubmissionData = {
  item: string;
  quantity: number;
  expDate: string;
  category: string;
};

export default function LogSurplusForm() {
    const [item, setItem] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [expDate, setExpDate] = useState("");
    const [category, setCategory] = useState("");
    const [showConfirmationScreen, setShowConfirmationScreen] = useState(false);
    const [submissionData, setSubmissionData] = useState<SubmissionData | null>(null);



    //populate all of the food categories
    const categories = [
        "Pastries", "Dairy", "Bread", "Produce", "Other",
    ];

    const noTyping = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const allowedKeys = [
            "Tab",
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "Escape",
            "Enter",

        ];
        if(!allowedKeys.includes(e.key)) {
            e.preventDefault();
        }
    }

    //placeholder errors for each category
    const [errors, setErrors] = useState({
        item: "",
        quantity: "",
        expDate: "",
        category: "",

    })

    //get current date and format
    //gets current date
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    //make minimum date that date
    const minDate = `${year}-${month}-${day}`;

    //actions to take once submit is pressed
    const handleSubmit = (e: FormEvent) => {
        //first checks if the information entered is valid, will throw error if not
        e.preventDefault();
        const errorList = {item: "", quantity: "", expDate: "", category: ""};
        let hasErrors = false;
        if (!item) {
            errorList.item = "An item is required";
            hasErrors = true;

        }
        if (!quantity) {
            errorList.quantity = "Quantity is required";
            hasErrors = true;
        }
        if (quantity <= 0) {
            errorList.quantity = "Quantity must be greater than 0";
            hasErrors = true;
        }

        if (!expDate) {
            errorList.expDate = "Expiration date must be filled";
            hasErrors = true;
        }

        setErrors(errorList);


        //if errorList isn't populated with errors (ie no errors shown), then control proceeds
        //to passing data and enabling the confirmation screen to show
        if(!hasErrors) {
            setSubmissionData({item, quantity, expDate, category});
            setShowConfirmationScreen(true)

            //reset fields to blank
            setItem("");
            setQuantity(0);
            setExpDate("");
            setCategory("");
        }
    }

    //ui page
    return (
        <>
        <div className={styles.container}>
            {/*Form header */}
            <h1 className={styles.header}>Log Surplus Item</h1>

            <div className={styles.formContainer}>
                <form onSubmit = {handleSubmit}>
                    <label className={styles.label}>Item*</label>
                    <input className={styles.input}
                        type = "text"
                        placeholder = "Enter item"
                        value = {item}
                        onChange = {(e) => setItem(e.target.value)}
                    />
                    {errors.item && <p className={styles.errors}>{errors.item}</p>}

                    <label className={styles.label}>Quantity*</label>
                    <input className={styles.input}
                        type = "number"
                        placeholder = "Enter quantity"
                        value = {quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                    {errors.quantity && <p className={styles.errors}>{errors.quantity}</p>}

                    <label className={styles.label}>Expiration Date*</label>
                    <input className={styles.input}
                           onKeyDown={noTyping}
                        type = "date"
                        placeholder = "Enter Date"
                        value = {expDate}
                        min = {minDate}
                        onChange = {(e) => setExpDate(e.target.value)}
                    />
                    {errors.expDate && <p className={styles.errors}>{errors.expDate}</p>}


                    <label className={styles.label}> Category (Optional)</label>
                    <select
                        className={styles.input}
                        value = {category}
                        onChange = {(e) => setCategory(e.target.value)}
                    >
                        <option value = ""> Select a category </option>
                        {categories.map((category) => (
                            <option key = {category} value = {category}>
                                {category}
                            </option>
                        ))}

                    </select>


                    {/*Code for Submit button */}
                    <button className={styles.submitButton}
                        type = "submit">
                        Submit
                    </button>
                </form>
            </div>

        </div>

        {showConfirmationScreen && submissionData && (
            <ConfirmationScreen
                data={submissionData}
                onClose={() => setShowConfirmationScreen(false)}
            />
        )}

        </>
    )



}