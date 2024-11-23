"use client";

import { SignIn, useUser } from "@clerk/nextjs";

export function SignInInner() {
    const { user } = useUser();

    return (
        <>
            <section className="flex justify-center items-center h-screen">
                <div className="right-[24px] fixed top-[24px] flex flex-col">
                    <span className="text-xs">Signed in as:</span>
                    <span className="text-sm">
                        {user?.primaryEmailAddress?.emailAddress}
                    </span>
                </div>

                <SignIn />
            </section>
        </>
    );
}
