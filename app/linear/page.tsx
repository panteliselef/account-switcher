"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    OrganizationList,
    SignInButton,
    SignOutButton,
    useClerk,
    useOrganization,
    useSession,
    useSessionList,
} from "@clerk/nextjs";
import Image from "next/image";
import React, { startTransition } from "react";

export default function LinearPage() {
    const { sessions, setActive } = useSessionList();
    const { organization } = useOrganization();
    const { session } = useSession();
    // 1. why don't we have openOrgList ?
    // 2. on Orglist should we hide the current org ?
    // 3. Why `<CreateOrganization/>` redirects on create ?
    // 4. I can't open directly to __experimental_startPath: "/members",
    // 5. OrganizationList sets active org before skip invite is clicked, same for CreateOrganization
    const { openCreateOrganization, openOrganizationProfile, openUserProfile } =
        useClerk();

    if (!organization) {
        return <OrganizationList hidePersonal />;
    }

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
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        onClick={() => {
                            openUserProfile();
                        }}
                    >
                        Preferences
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openOrganizationProfile()}>
                        Workspace settings
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() =>
                            openOrganizationProfile({
                                // @ts-expect-error this is not known
                                __experimental_startPath: "/members",
                            })
                        }
                    >
                        Invite and manage members
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Download desktop app</DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            Switch workspace
                        </DropdownMenuSubTrigger>

                        <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup
                                value={JSON.stringify({
                                    sessionId: session?.id,
                                    organizationId: organization?.id,
                                })}
                                onValueChange={(value) => {
                                    startTransition(() => {
                                        // dispatch(JSON.parse(value));
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
                                        <DropdownMenuLabel className="font-light text-zinc-500 h-[30px]">
                                            {
                                                session.user
                                                    ?.primaryEmailAddress
                                                    ?.emailAddress
                                            }
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
                            <DropdownMenuItem
                                onClick={openCreateOrganization.bind(null, {
                                    hideSlug: true,
                                })}
                            >
                                Create or join a workspace
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <SignInButton>Add an account</SignInButton>
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    {/* {(userMemberships.count || 0) > 0 ? (
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                Switch workspace
                            </DropdownMenuSubTrigger>

                            <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup
                                    value={organization.id}
                                    onValueChange={(id) =>
                                        setActive?.({ organization: id })
                                    }
                                >
                                    {userMemberships.data?.map((mem) => (
                                        <React.Fragment key={mem.id}>
                                            <DropdownMenuLabel className="font-light text-zinc-500 h-[30px]">
                                                {mem.publicUserData.identifier}
                                            </DropdownMenuLabel>
                                            <DropdownMenuRadioItem
                                                value={mem.organization.id}
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
                                        </React.Fragment>
                                    ))}
                                </DropdownMenuRadioGroup>

                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    Create or join a workspace
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <SignInButton>Add an account</SignInButton>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                    ) : null} */}
                    <SignOutButton signOutOptions={{ sessionId: session?.id }}>
                        <DropdownMenuItem>Log out</DropdownMenuItem>
                    </SignOutButton>
                </DropdownMenuContent>
            </DropdownMenu>
        </section>
    );
}
