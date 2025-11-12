import {Request, Response} from 'express'
import cloudinary from '../config/cloudinary.config'
import { AuthRequest } from '../middlewares/auth.middleware'
import { Post } from '../models/post.model'

// /api/v1/post/create
export const savePost = async(req: AuthRequest, res: Response) => {
    // req.file?.buffer -> meken file eke onim data ekk eliyt gnn puluwan

    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const {title, content, tags} = req.body       

        let imageURL = ''

        if (req.file) {
            const result: any = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'smart-blog/posts' },
                    (error, result) => {
                        if (error) {
                            console.error(error)
                            return reject(error)
                        }
                        resolve(result) // success return
                    }
                )
                uploadStream.end(req.file?.buffer)
            })
            imageURL = result?.secure_url
        }

        const newPost = new Post({
            title,
            content,
            tags: tags.split(','), // tags eka comma separated string ekak widiyta enwa. array ekk widiyt db eke save wenw. "mobile,tech,news" => ["mobile", "tech", "news"]
            imageURL,
            author: req.user.sub // from auth middleware eke user object ekta add krpu id eka gnnwa
        })

        // save post to DB with imageURL
        await newPost.save()

        res.status(201).json({ message: 'Post created successfully', data: newPost })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Fail to save post' })
    }
}

// /api/v1/post?page=1&limit=10
export const getAllPost = async(req: Request, res: Response) => {
    try {
        // Pagination
        // use query parameters to get page and limit
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const skip = (page - 1) * limit

        const posts = await Post.find()
        .populate('author', 'firstName email')  // related model eke data gnnn use krnw
        .sort({ createdAt: -1 })    // descending order
        .skip(skip)     // ignore data for pagination 
        .limit(limit)   // data count for current page

        const total = await Post.countDocuments()
        
        return res.status(200).json({
            message: 'Posts data',
            data: posts,
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            page
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to get post.!' })
    }
}

// /api/v1/post/me
export const getMyPost = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        // Pagination
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const skip = (page - 1) * limit

        // Find posts created by the logged-in user
        const posts = await Post.find({ author: req.user.sub })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const total = await Post.countDocuments({ author: req.user.sub })

        return res.status(200).json({
            message: "posts fetched successfully",
            data: posts,
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            page
        });

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to get your posts." })
    }
}
