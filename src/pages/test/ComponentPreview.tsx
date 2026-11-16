import { useState } from "react";

import Button from "../../components/common/button/Button.tsx";
import Input from "../../components/common/input/Input.tsx";
import Select from "../../components/common/select/Select.tsx";
import Modal from "../../components/common/modal/Modal.tsx";

function ComponentPreview() {
    const [name, setName] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const options = [
        { label: "Candidate", value: "candidate" },
        { label: "Recruiter", value: "recruiter" },
        { label: "Admin", value: "admin" },
    ];

    return (
        <div style={{ padding: "32px", background: "#E3F2FD", minHeight: "100vh" }}>
            <h1 style={{ marginBottom: "32px" }}>
                SIRS - Component Library Preview
            </h1>

            {/* BUTTON */}
            <section style={{ marginBottom: "40px" }}>
                <h2>1. Button</h2>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="primary" disabled>Disabled</Button>
                    <Button variant="primary" loading>Loading</Button>
                </div>
            </section>

            {/* INPUT */}
            <section style={{ marginBottom: "40px", maxWidth: "400px" }}>
                <h2>2. Input</h2>

                <div style={{ marginTop: "16px" }}>
                    <Input
                        label="Full Name"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>

                <div style={{ marginTop: "16px" }}>
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                    />
                </div>

                <div style={{ marginTop: "16px" }}>
                    <Input
                        label="Email"
                        placeholder="Enter your email"
                        error="Email is invalid"
                    />
                </div>
            </section>

            {/* SELECT */}
            <section style={{ marginBottom: "40px", maxWidth: "400px" }}>
                <h2>3. Select</h2>

                <div style={{ marginTop: "16px" }}>
                    <Select
                        label="Role"
                        options={options}
                        placeholder="Select your role"
                    />
                </div>

                <div style={{ marginTop: "16px" }}>
                    <Select
                        label="Role"
                        options={options}
                        error="Please select a role"
                    />
                </div>
            </section>

            {/* MODAL */}
            <section style={{ marginBottom: "40px" }}>
                <h2>4. Modal</h2>

                <div style={{ marginTop: "16px" }}>
                    <Button onClick={() => setIsModalOpen(true)}>
                        Open Modal
                    </Button>
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Confirm Information"
                    footer={
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </Button>

                            <Button onClick={() => setIsModalOpen(false)}>
                                Confirm
                            </Button>
                        </>
                    }
                >
                    <p>This is a preview of the SIRS Modal component.</p>
                </Modal>
            </section>
        </div>
    );
}

export default ComponentPreview;