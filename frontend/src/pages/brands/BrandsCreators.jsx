import { LoaderCircle, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { brands } from "../../components/data/Brands";
import BrandCard from "../../components/ui/BrandCard";
import { fetchBrands } from "../../services/CreatorListBrands";
import { useAuth } from "../../context/context";

const PAGE_SIZE = 9
const check_btn = [
  'All', 'Beauty', 'Lifestyle', 'Food', 'Travel', 'Tech', 'Agriculture', 'Gamings',
  'Fitness', 'Health', 'Fashion', 'Comedy', 'Entertainment','sports', 'Business',
  'Video', 'Photography', 'UGC', 'Editorial', 'Review', 'livestream', 'music', 'family', 'Parenting'
]
export default function BrandsCreators(){
    const { loading, user } = useAuth()
const [check, setCheck]=useState('All')
const [page, setPage] =useState(1)
const [dataBrands, setDataBrands] = useState([])
const [brandLoading, setBrandLoading] = useState(true)

const filteredBrands = check === 'All' ? dataBrands : dataBrands.filter((brand)=> brand.speciality_tags.includes(check))

const totalPages = Math.ceil(filteredBrands.length/ PAGE_SIZE)

const startIndex = (page - 1) * PAGE_SIZE;

const visibleBrands = filteredBrands.slice(startIndex, startIndex + PAGE_SIZE)

  const handleCategoryClick = (btn) => {
    setCheck(btn)
    setPage(1)
  }

  useEffect(() => {
    if (!user) return;

    const listBrands = async()=>{
        try{
          const data = await fetchBrands()
          
          setDataBrands(data)
          
        }catch(err){
            console.error(err)
            toast.error("Failed to fetch brands. Please try again later.")
        }finally{
            setBrandLoading(false)
        }
    }

    listBrands()
  }, [user])

  if (loading || brandLoading) return (
    <div className="flex items-center justify-center flex-col gap-4 min-h-screen">
        <p>fetching data...</p>
        <LoaderCircle className="animate-spin w-6 h-6 text-sky-500" />
    </div>
)

    return(
        <section className='max-w-[1200px] mx-auto py-12 px-6'>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Browse Brands
            </h1>
            <p className="text-gray-500 mt-3">
              Discover Kenyan brands actively looking for creators like you.
            </p>

           <div className='flex flex-col gap-4 mt-8'>
            <div className='relative max-w-xl w-full'>
                <Search className='w-6 h-6 absolute left-4 top-4 text-gray-400' />
                <input 
                type='text'
                placeholder='Search Creators, Categories, Tags...'
                className="w-full pl-14 py-4 bg-white border border-gray-200 rounded-xl text-[12px] outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-colors duration-150"
                />
            </div>
            <div className='flex flex-wrap items-center gap-2'>
                {check_btn.map((btn) => (
                <button
                    key={btn}
                    onClick={() => handleCategoryClick(btn)}
                    className={`px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-colors ${
                    check === btn 
                        ? "bg-gray-900 text-white" 
                        : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                    }`}
                >
                    {btn}
                </button>
                ))}
            </div>
            </div>

            <div className="max-w-[1200px] mx-auto py-10">
                {visibleBrands.length === 0 ? (
                    <p className="text-center text-gray-400 py-20">No brands match this tag.</p>
                ) : ( 
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleBrands.map((brand)=>(
                    <BrandCard key={brand.id} {...brand}/>
                    ))}
                </div>
                )}

                <div className="flex items-center justify-center gap-3 mt-12">
                    <button
                    onClick={()=>setPage((p)=>Math.max(p-1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg border border-blue-50 text-sm bg-gray-200 font-bold text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-200"
                    >
                        Previous
                    </button>

                    <span>
                        Page {page} of {totalPages || 1}
                    </span>

                    <button
                    onClick={()=>setPage((p)=>Math.min(p+1, totalPages))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg border border-blue-50 text-sm bg-gray-200 font-bold text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-200"
                    >
                        Next
                    </button>

                </div>
            </div>


        </section>
    )
}