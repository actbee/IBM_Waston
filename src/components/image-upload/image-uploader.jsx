export const uploadDocuments = async (files, setDisplayedImage, task, shownImages = null, setIsLoading = null) => {
    if(task === "training"){
    setIsLoading(true);
    }
    const filePromises = files.map((file) => {
      // Return a promise per file
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            // Resolve the promise with the response value
            resolve(reader.result);
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    });

    // Wait for all promises to be resolved
    await Promise.all(filePromises).then((values) => {
        if(task === "training"){
        setDisplayedImage([...shownImages, ...values]);
        setIsLoading(false);
        }
        else{
        setDisplayedImage(values);
        }
    })

  };

