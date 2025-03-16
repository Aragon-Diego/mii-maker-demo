export const GenderButton = (props) => {
  return (
    <>
      <button className="GenderButton">
        {props.gender == 'male' ? (
         <svg width="170" height="170" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.3697 5.07947C19.3697 7.3325 17.5433 9.15894 15.2903 9.15894C13.0372 9.15894 11.2108 7.3325 11.2108 5.07947C11.2108 2.82644 13.0372 1 15.2903 1C17.5433 1 19.3697 2.82644 19.3697 5.07947Z" fill="#3587F5"></path><path d="M13.2249 9.43709H12.7869C10.5617 11.1987 8.70741 16.0199 8.0584 17.8742C7.68763 18.9338 9.17107 20.0066 10.0054 18.4305L12.3234 14.6291V27.9801C12.2616 28.3201 12.4161 29 13.5287 29C14.6413 29 14.8576 28.3201 14.8267 27.9801V20.7483C14.8267 20.5435 14.9927 20.3775 15.1976 20.3775H15.3828C15.5876 20.3775 15.7537 20.5435 15.7537 20.7483V27.9801C15.7228 28.3201 15.9391 29 17.0517 29C18.1643 29 18.3188 28.3201 18.257 27.9801V14.6291L20.575 18.4305C21.4093 20.0066 22.8928 18.9338 22.522 17.8742C21.873 16.0199 20.0187 11.1987 17.7935 9.43709H17.3557C16.7297 9.73434 16.0294 9.90066 15.2903 9.90066C14.5512 9.90066 13.8509 9.73434 13.2249 9.43709Z" fill="#3587F5"></path></svg>
        ):(
          <svg width="170" height="170" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.3947 5.07947C19.3947 7.3325 17.5682 9.15894 15.3152 9.15894C13.0622 9.15894 11.2357 7.3325 11.2357 5.07947C11.2357 2.82644 13.0622 1 15.3152 1C17.5682 1 19.3947 2.82644 19.3947 5.07947Z" fill="#FF4585"></path><path d="M12.8118 9.43709H13.2498C13.8758 9.73434 14.5761 9.90066 15.3152 9.90066C16.0543 9.90066 16.7546 9.73434 17.3806 9.43709H17.8184C20.0436 11.1987 21.8979 16.0199 22.5469 17.8742C22.9177 18.9338 21.4342 20.0066 20.5999 18.4305L18.2819 14.6291L19.8131 20.1357C19.9117 20.4902 19.6451 20.8411 19.2772 20.8411H18.2819V27.9801C18.3437 28.3201 18.1892 29 17.0766 29C15.964 29 15.7477 28.3201 15.7786 27.9801V20.8411H14.8516V27.9801C14.8825 28.3201 14.6662 29 13.5536 29C12.441 29 12.2865 28.3201 12.3483 27.9801V20.8411H11.353C10.9851 20.8411 10.7185 20.4902 10.8171 20.1357L12.3483 14.6291L10.0303 18.4305C9.19598 20.0066 7.71253 18.9338 8.0833 17.8742C8.73231 16.0199 10.5866 11.1987 12.8118 9.43709Z" fill="#FF4585"></path></svg>
        )}
        <h1>{props.gender == 'male' ? ('Male'):('Female')}</h1>
      </button>
    </>
  )
}

/*

   


      
*/