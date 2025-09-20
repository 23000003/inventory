

const Inventory = () => {

    return (
        <div className="flex flex-row gap-24">
            {/* Filters */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-4 text-lg">
                    <span>All</span>
                    <p>/</p>
                    <span>Bestsellers</span>
                </div>

                <div className="flex flex-col gap-4 border-t pt-6">
                    <p className="text-xl font-semibold">Price</p>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <p>Checkbox</p>
                            <p>From P0.00 to P900.00</p>
                            <p>(5)</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p>Checkbox</p>
                            <p>From P0.00 to P900.00</p>
                            <p>(5)</p>
                        </div>
                    </div>
                    <span>Show More v</span>
                </div>

                <div className="flex flex-col gap-4 border-t pt-6">
                    <p className="text-xl font-semibold">Categories</p>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <p>Checkbox</p>
                            <p>From P0.00 to P900.00</p>
                            <p>(5)</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p>Checkbox</p>
                            <p>From P0.00 to P900.00</p>
                            <p>(5)</p>
                        </div>
                    </div>
                    <span>Show More v</span>
                </div>
                
            </div>

            {/* display */}
            <div className="flex flex-col gap-10 w-[900px]">
                <div className="flex flex-row items-center justify-between border-b pb-4">
                    <span>Searchbar input</span>
                    <div className="flex flex-row items-center gap-7">
                        <p className="text-lg">SORT BY</p>
                        <p>Sort Dropdown Here</p>
                    </div>
                </div>
                {/* display items */}
                <div className="flex flex-col">
                    <span>
                        <p className="text-2xl font-semibold">All</p>
                        <p>1 - 24 of 1278 results</p>
                    </span>
                    <p>items here</p>
                </div>
            </div>
        </div>
    )
}

export default Inventory;