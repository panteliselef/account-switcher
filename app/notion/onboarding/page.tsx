import { OrganizationList } from "@clerk/nextjs";

export default function OnboardingPage() {
    return (
        <>
            <OrganizationList hidePersonal />
        </>
    );
}
