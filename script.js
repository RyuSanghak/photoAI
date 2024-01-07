function uploadImage(input) {
  const file = input.files[0];

  if (file) {
    const imageConatiner = document.getElementById('image-container');
    const uploadedImage = document.getElementById('uploaded-image');

    const reader = new FileReader();
    reader.onload = function(e) {
      uploadedImage.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }
  if (!file) {
    const uploadedImage = document.getElementById('uploaded-image');

    uploadedImage.src = "images/AI.jpg";
  }
}

async function generateContent() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) {
    showAlert('Please select an image file.');
    return;
  }

  try {
    showSpinner();
    const imageContainer = document.getElementById('image-container');
    const uploadedImage = document.getElementById('uploaded-image');
    imageContainer.classList.remove('hidden');
    uploadedImage.src = URL.createObjectURL(file);

    const response = await fetch('http://localhost:3000/generate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageData: await toBase64(file)
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate content.');
    }

    const result = await response.json();
    const resultText = result.text.includes('.') ? result.text.replace(/\./g, '.\n') : result.text;

    Swal.fire({
      icon: 'success',
      title: 'Generated Content',
      text: resultText,
    });

    hideSpinner();

  } catch (error) {
    console.error(error);
    showAlert('제가 뭔가 이상한 말을 했나봐요... 다시 답변을 생성해 주세요.');
    hideSpinner();
  }
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });
}

function showAlert(message) {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
  });
}
function showSpinner() {
  const spinner = document.getElementById('loading');
  spinner.style.display = 'flex';
}

function hideSpinner() {
  const spinner = document.getElementById('loading');

  if (spinner !== null) {
    spinner.style.display = 'none';
  }
  else {
    const newSpinner = document.createElement('div');
    newSpinner.id = 'spinner';
    newSpinner.classList.add('loading-spinner');
    document.body.appendChild(newSpinner);
    newSpinner.style.display = 'none';
  }
}
