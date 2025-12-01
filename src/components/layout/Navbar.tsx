"use client";
import { useContext } from "react";
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
} from "@/lib/heroui";
import { AuthContext } from "../contexts/AuthContext";

export default function CustomNavbar() {
    const authContext = useContext(AuthContext);
    return (
        <Navbar isBordered>
            <NavbarContent justify="start">
                <NavbarBrand className="mr-4">
                    <p className="hidden sm:block font-bold text-inherit">Lift-On</p>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-3">
                    <NavbarItem>
                        <Link href="/">Home</Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link href="/exercises">Exercises</Link>
                    </NavbarItem>
                </NavbarContent>
            </NavbarContent>

            <NavbarContent as="div" className="items-center" justify="end">
                {(!authContext.user) ? (
                    <NavbarItem>
                        <Link href="/auth">Log In</Link>
                    </NavbarItem>
                ) : (<Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <p className="font-semibold">{authContext.user?.username}</p>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="track" href="track">Track</DropdownItem>
                        <DropdownItem key="profile" href="/me">Profile</DropdownItem>
                        {authContext.user?.role === "ADMIN" ? (
                            <DropdownItem key="admin" href="/admin">Admin Panel</DropdownItem>
                        ) : null}
                        <DropdownItem key="logout" color="danger" onPress={authContext.logout}>
                            Log Out
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                )}
            </NavbarContent>
        </Navbar >
    );
}
