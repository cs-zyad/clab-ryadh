export const TYPE_LABELS = { tweet: 'تغريدة', photo: 'صورة', event: 'فعالية', star: 'نجم الشهر' }
// Badge colours (panel.css)
export const TYPE_TONES = { tweet: 'tone-blue', photo: 'tone-purple', event: 'tone-amber', star: 'tone-gold' }

// `editingId` is set when the form is editing an existing post instead of creating one
// `name` / `department` are only used when type is 'star'
export const EMPTY_DRAFT = {
  type: 'tweet', text: '', image: null, imageName: '', link: '',
  name: '', department: '', editingId: null,
}

export const SAVED_IMAGE_LABEL = 'صورة محفوظة (اضغط لتغييرها)'
