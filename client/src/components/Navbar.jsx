
export default function Navbar() {
    return(
        <div className="flex justify-around bg-[#070707]"> 
            <div className="flex gap-4"> 
                <img 
                class="h-15 w-11"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/TMU_logo.svg/1024px-TMU_logo.svg.png" /> 
                <div className="">
                    <h1 className="text-[#00C6E8] text-sm"> Tutor Connect </h1>
                    <h2 className="text-[#00C6E8] text-sm"> All Canadian Universities </h2>
                </div>
            </div>
        </div>
    );
}