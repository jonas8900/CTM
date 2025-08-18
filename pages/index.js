import Loading from "@/components/loading/Loading";
import SwitchingThemes from "@/components/theme/switchThemes";

export default function Home() {
    return(
        <>
            <h1 className="text-2xl">CatchTheMoment</h1>
            <SwitchingThemes/>
        </>
    )
}