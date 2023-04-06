
export default function CardSkeleton(){
    return (
        <div>
            <div className="h-[350px] w-[200px] flex flex-col gap-3 border rounded-lg drop-shadow-lg">
                <div className="bg-slate-300 rounded-t-lg">
                    <img src="https://images.unsplash.com/photo-1626121496372-8e1b2e1b2b1f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" alt="" className="h-[200px] w-[200px] rounded-t-lg"/>
                </div>
                <div className="flex gap-4 justify-around px-2">
                    <h2 className="text-sm ">Playstation 4 </h2>
                    <h2 className="text-sm">Rp.5.645.000</h2>
                </div>
                <div className="flex justify-center">
                    Tangerang Selatan
                </div>
                {/* <div className="flex justify-center">
                    <button className="bg-green-300 rounded-lg p-2 w-[150px]">add to cart</button>
                </div> */}
                <div>rating</div>
            </div>
        </div>
    )
}