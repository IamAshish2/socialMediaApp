import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostList from "./GridPostList";

type searchResultProps = {
  searchPosts: Models.Document[];
  isSearchFetching: boolean;
}

const SearchResults = ({ searchPosts, isSearchFetching }: searchResultProps) => {
  if (isSearchFetching) {
    return <Loader />
  }

  if (searchPosts && searchPosts.documents.length > 0) {
    return (
      <GridPostList posts={searchPosts.documents} />
    )
  }

  return (
    <p className="text-light-4 text-center w-full">
      No search results found
    </p>
  )
}

export default SearchResults
