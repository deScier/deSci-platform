import { Author } from "@/mock/submit_new_document";
/**
 * @title Calculate Remaining Share Function
 * @notice This function is used to distribute a share value evenly among authors, excluding the current author, and update their shares accordingly.
 * @dev This function takes the ID of the current author, their new share percentage, a list of authors, and a setter function for updating authors. It calculates the new share percentage for other authors and updates the state.
 * @param {string} currentAuthorId - The unique identifier of the current author.
 * @param {string} newAuthorShare - The new share percentage for the current author, in string format with a '%' symbol.
 * @param {Author[]} authors - An array of author objects.
 * @param {(authors: Author[]) => void} setAuthors - A setter function for updating the authors' array.
 */
export const calculateRemainingShare = (
  currentAuthorId: string,
  newAuthorShare: string,
  authors: Author[],
  setAuthors: (authors: Author[]) => void
) => {
  const newShareValue = parseFloat(newAuthorShare.replace("%", ""));

  const updatedAuthors = authors.map((author) => {
    if (author.id === currentAuthorId) {
      return { ...author, share: `${newShareValue}%` };
    }
    return author;
  });

  const remainingShare = 100 - newShareValue;
  const otherAuthorsCount = authors.length - 1;

  if (otherAuthorsCount > 0) {
    const sharePerAuthor = remainingShare / otherAuthorsCount;

    updatedAuthors.forEach((author) => {
      if (author.id !== currentAuthorId) {
        author.share = `${sharePerAuthor}%`;
      }
    });
  }

  setAuthors(updatedAuthors);
};

/**
 * @title Update Authors' Shares in Single Author Scenario
 * @notice Adjusts the share of a single author to 100% if it is not already set to this value. This is typically used in scenarios where there is only one author in the list.
 * @dev This useEffect hook triggers whenever the authors array or the setValue function changes. It checks if there is only one author and updates their share to 100% if it's not already. It then updates the authors state and a form value 'authors'.
 * @param {Author[]} authors - A dependency array containing the current list of authors. React will re-run the effect if this array changes.
 * @param {Function} setValue - A dependency function from a form library (like React Hook Form) used to update the value of 'authors' in the form state.
 * 
 * 
 * React.useEffect(() => {
    if (authors.length === 1 && authors[0].share !== '100%') {
       const updatedAuthors = [{ ...authors[0], share: '100%' }]
 
       setAuthors(updatedAuthors)
       setValue('authors', updatedAuthors)
    }
 }, [authors, setValue])
 */
