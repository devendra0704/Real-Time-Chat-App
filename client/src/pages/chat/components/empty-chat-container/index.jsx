const EmptyChatContainer = () => {
    return (
        <div className="flex-1 md:bg-slate-800 flex flex-col justify-center items-center md:flex duration-1000 transition-all">
            <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
                <h3>Hi! Welcome to Chat</h3>
            </div>
        </div>
    );
}

export default EmptyChatContainer;
