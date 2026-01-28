'use client';

import { errorIcon } from "../../assets/img/icons"
import Button from "../ui/Button"

const PageError = () => {
    return (
        <div className="flex flex-col align-center px-lg-2 h-min-100 justify-center">
            <p className="fs-20 text-center">
                Something went wrong
            </p>
            <p className="fs-12 text-center text-secondary mt-1">
                Please try again.<br/>If the problem persists, contact support.
                <br/>
            </p>
            <div className="flex align-center mt-4 gap-2">
                <Button
                    type="secondary"
                    variant="outline"
                    label="Support"
                    onClick={() => window.open('mailto:support@forkhr.com?subject=Support Request&body=Please describe your issue in detail.')}
                />
                <Button
                    label="Try again"
                    onClick={() => window.location.reload()}
                    type="brand"
                    variant="filled"
                />
            </div>
        </div>
    )
}

export default PageError