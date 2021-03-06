import { Router, Request, Response, NextFunction } from 'express';
import { FeedItem } from '../models/FeedItem';
import { requireAuth, requireFeedData } from '../middlewares/feed.middleware';
import * as AWS from '../../../services/aws';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  const items = await FeedItem.findAndCountAll({ order: [['id', 'DESC']] });
  items.rows.map((item) => {
    if (item.url) {
      item.url = AWS.getGetSignedUrl(item.url);
    }
  });

  return res.status(200).send(items);
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  if (isNaN(Number(id))) {
    return res.status(401).json({ error: { message: 'The feed item id must be a valid integer.' } });
  }
  const item = await FeedItem.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: { message: 'No feed with the given id found.' } });
  item.url = AWS.getGetSignedUrl(item.url);

  return res.status(200).json(item);
});

router.get('/signed-url/:fileName',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fileName } = req.params;
      if (!fileName) {
        return res
          .status(400)
          .json({ error: { message: 'A valid filename must be provided.' } });
      }
      const url = AWS.getPutSignedUrl(fileName);

      return res.status(201).send({ url: url });
    } catch (error) {
      return next(error);
    }
  }
);

router.patch('/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const item = await FeedItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: { message: 'No feed with the given id found.' } });
    if (req.body.caption) item.caption = req.body.caption;
    if (req.body.url) item.url = req.body.url;
    await item.save();
    item.url = AWS.getGetSignedUrl(item.url);

    return res.status(200).json(item);
});

router.post('/',
  requireAuth,
  requireFeedData,
  async (req: Request, res: Response) => {
    const caption = req.caption;
    const fileName = req.fileName;
    const item = new FeedItem({
      caption: caption,
      url: fileName,
    });
    const saved_item = await item.save();
    const filePublicUrl = AWS.getGetSignedUrl(fileName);
    saved_item.url = filePublicUrl;

    return res.status(201).send(saved_item);
});

export const FeedRouter: Router = router;
