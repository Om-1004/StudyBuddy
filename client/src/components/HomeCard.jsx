export default function HomeCard({ icon, title, text }) {
    return(
        <div className="flex flex-col items-center space-y-2 border px-20 bg-white md:max-w-[330px] max-w-[250px] pb-10 rounded-lg">
            <img src={icon} className="w-16 h-16 rounded-full my-5" />
            <h2 className="text-lg font-semibold"> {title} </h2>
            <p className="text-gray-500 text-center text-xs"> {text} </p>
        </div>
    );
}
