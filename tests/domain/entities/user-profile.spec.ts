import { UserProfile } from '@/domain/entities'

describe('UserProfile', () => {
  let sut: UserProfile

  beforeEach(() => {
    sut = new UserProfile('any_id')
  })

  it('should create with empty initials when pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url', name: 'any_name' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    })
  })

  it('should create with empty initials when pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    })
  })

  it('should create with initials with first letter of first and last names', () => {
    sut.setPicture({ name: 'fernando da silva tomio' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'FT'
    })
  })

  it('should create with initials with first two letter of first name', () => {
    sut.setPicture({ name: 'fernando' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'FE'
    })
  })

  it('should create with initials with first letter', () => {
    sut.setPicture({ name: 'f' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'F'
    })
  })

  it('should create with empty initials when name and pictureUrl are not provided', () => {
    sut.setPicture({})
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: undefined
    })
  })

  it('should create with empty initials when name and pictureUrl are not provided', () => {
    sut.setPicture({ name: '' })
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: undefined
    })
  })
})
