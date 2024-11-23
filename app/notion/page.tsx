"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    OrganizationList,
    SignInButton,
    SignOutButton,
    useOrganization,
    useSession,
    useSessionList,
} from "@clerk/nextjs";
import { MoreHorizontal, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { startTransition } from "react";

export default function NotionPage() {
    const { sessions, setActive } = useSessionList();
    const { organization } = useOrganization();
    const { session } = useSession();
    const router = useRouter();

    if (!organization) {
        return <OrganizationList hidePersonal />;
    }

    //     <DropdownMenuItem
    //     onClick={() => openOrganizationProfile()}
    // >
    //     Workspace settings
    // </DropdownMenuItem>
    // <DropdownMenuItem
    //     onClick={() =>
    //         openOrganizationProfile({
    //             // @ts-expect-error this is not known
    //             __experimental_startPath: "/members",
    //         })
    //     }
    // >
    //     Invite and manage members
    // </DropdownMenuItem>

    return (
        <section className="max-w-lg mx-auto flex items-center justify-center h-screen">
            <DropdownMenu>
                <DropdownMenuTrigger className="rounded-md transition-colors outline-none pl-2 pr-3 gap-2 flex font-sm items-center justify-center h-[28px] hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
                    <Image
                        className="rounded-md"
                        alt={`Avatar of ${organization.name}`}
                        src={organization.imageUrl}
                        width={20}
                        height={20}
                    />

                    <div>{organization.name}</div>

                    <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#fbfaf9] p-0">
                    <div className="p-[12px] bg-white border-b border-gray-200">
                        <div className="flex gap-3 items-center mb-[12px]">
                            <Image
                                className="rounded-md"
                                alt={`Avatar of ${organization.name}`}
                                src={organization.imageUrl}
                                width={36}
                                height={36}
                            />

                            <div className="flex flex-col w-full">
                                <div className="text-sm font-bold">
                                    {organization.name}
                                </div>
                                <div className="text-sm">
                                    {organization.membersCount} Members
                                </div>
                            </div>
                        </div>
                        <div className="inline-flex gap-2 items-center">
                            <button className="border p-1 rounded-md text-sm">
                                Settings
                            </button>

                            <button className="border p-1 rounded-md text-sm">
                                Invite members
                            </button>
                        </div>
                    </div>
                    <div className="p-1">
                        <DropdownMenuRadioGroup
                            value={JSON.stringify({
                                sessionId: session?.id,
                                organizationId: organization?.id,
                            })}
                            onValueChange={(value) => {
                                startTransition(() => {
                                    const { sessionId, organizationId } =
                                        JSON.parse(value);
                                    setActive?.({
                                        session: sessionId,
                                        organization: organizationId,
                                    });
                                });
                            }}
                        >
                            {sessions?.map((session) => (
                                <React.Fragment key={session.id}>
                                    <DropdownMenuLabel className="text-zinc-500 h-[30px] text-xs w-full flex justify-between">
                                        <span>
                                            {
                                                session.user
                                                    ?.primaryEmailAddress
                                                    ?.emailAddress
                                            }
                                        </span>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <MoreHorizontal className="size-4" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem
                                                    onClick={async () => {
                                                        await setActive({
                                                            session: session.id,
                                                        });
                                                        router.push(
                                                            "/notion/onboarding"
                                                        );
                                                    }}
                                                >
                                                    Join or create workspace
                                                </DropdownMenuItem>
                                                <SignOutButton
                                                    signOutOptions={{
                                                        sessionId: session.id,
                                                    }}
                                                >
                                                    <DropdownMenuItem>
                                                        Sign out
                                                    </DropdownMenuItem>
                                                </SignOutButton>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </DropdownMenuLabel>

                                    {session.user?.organizationMemberships.map(
                                        (mem) => (
                                            <DropdownMenuRadioItem
                                                key={mem.organization.id}
                                                value={JSON.stringify({
                                                    sessionId: session.id,
                                                    organizationId:
                                                        mem.organization.id,
                                                })}
                                                className="pl-2 gap-2"
                                            >
                                                <Image
                                                    className="rounded-md"
                                                    alt={`Avatar of ${mem.organization.name}`}
                                                    src={
                                                        mem.organization
                                                            .imageUrl
                                                    }
                                                    width={18}
                                                    height={18}
                                                />

                                                {mem.organization.name}
                                            </DropdownMenuRadioItem>
                                        )
                                    )}
                                </React.Fragment>
                            ))}
                        </DropdownMenuRadioGroup>

                        <DropdownMenuSeparator />

                        <SignInButton>
                            <DropdownMenuItem>Add an account</DropdownMenuItem>
                        </SignInButton>
                        <SignOutButton>
                            <DropdownMenuItem>
                                Log out all accounts
                            </DropdownMenuItem>
                        </SignOutButton>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Get Mac app</DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </section>
    );
}
