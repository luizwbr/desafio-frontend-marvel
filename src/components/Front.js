import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios';
import md5 from 'md5';
import logo from '../assets/logo.png';
import Container from '@material-ui/core/Container';

import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
        Data provided by Marvel. © 2020 Marvel
    </Typography>
  );
}

export default class Front extends React.Component { 
    static propTypes = {
        classes: PropTypes.object,
    };

    componentDidMount() {
        this.searchCharacters();
    }

    state = {
        characters: [],
        searchText: '',
        canSearch: true
    };  

    searchCharacters = () => {
        const { searchText, canSearch } = this.state;
        if (canSearch) {           
            const PUBLIC_KEY = '9626e8c5b9deed4f720b73032d6f4a98';
            const PRIVATE_KEY = 'cd027465aa6bb97e1569a764af8a1df90cebe237';
            const timestamp = new Date().getTime();
            const hash = md5(`${timestamp}${PRIVATE_KEY}${PUBLIC_KEY}`);
            
            const searchParam = searchText?`&name=${searchText}`:'';
            axios.get(`https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${PUBLIC_KEY}&hash=${hash}${searchParam}`)
            .then(res => {
                const { data: characters } = res.data;
                this.setState({ characters, canSearch: false });
            });
        }
    };

    handleChangeSearch = ({ target }) => {
        const { value } = target || '';
        const { searchText: previousSearchedText } = this.state;
        const canSearch = previousSearchedText !== value;
        this.setState({
            searchText: value,
            canSearch
        });
    }

    handleClickButton = () => {
        this.searchCharacters();
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.searchCharacters();
        }
    }
    handleViewDetails = (link) => {
        window.location.href = link;
    }

    renderLoading() {
        return (
            <Container maxWidth="sm">
                <Grid container spacing={2} justify="center">
                    <CircularProgress />
                </Grid>
            </Container>
        );
    }

    renderNoResults() {
        return (
            <Container maxWidth="sm">
                <Grid container spacing={2} justify="center">
                    <Typography component="h3" variant="h4" align="center" color="textSecondary" gutterBottom>
                        No characters were found.
                    </Typography>
                </Grid>
            </Container>
        );
    }

    renderCharacters = (items) => {
        const { classes } = this.props;
        const { results, count } = items;
        if (count === 0)
            return this.renderNoResults();
        else if (count > 0)
            return results.map(item => {
                const { 
                    id,
                    name,
                    thumbnail,
                    resourceURI
                } = item;
                const { path: imagePath, extension: imageExtension } = thumbnail;
                const image = `${imagePath}.${imageExtension}`;
                return (
                    <Grid item key={id} xs={12} sm={6} md={4}>
                        <Card className={classes.card}>
                            <CardMedia
                                className={classes.cardMedia}
                                image={image}
                                title={name}
                                />
                            <CardContent className={classes.cardContent}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {name}
                                </Typography>                                
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary" onClick={() => this.handleViewDetails(resourceURI)}>
                                    View
                                </Button>
                                <Button size="small" color="primary">
                                    Edit
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                )});
            else 
                return this.renderLoading();
    }

    render() {
        const { classes } = this.props;
        const { characters, searchText } = this.state;
        return (
            <React.Fragment>
                <CssBaseline />
                <AppBar position="relative">
                    <Toolbar>
                        <img src={logo} height="50"/>
                    </Toolbar>
                </AppBar>
                <main>
                    <div className={classes.heroContent}>
                        <Container maxWidth="sm">
                            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                                Characters list
                            </Typography>
                            <div className={classes.heroButtons}>
                                <Grid container spacing={2} justify="center">
                                    <Grid item>
                                        <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
                                            <OutlinedInput
                                                id="outlined-search"
                                                value={searchText}
                                                placeholder="Search"
                                                onChange={this.handleChangeSearch}
                                                onKeyDown={this.handleKeyDown}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={this.handleClickButton}
                                                        >
                                                        <SearchIcon />
                                                      </IconButton>
                                                    </InputAdornment>
                                                  }
                                                fullWidth                          
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </div>
                        </Container>
                    </div>
                    <Container className={classes.cardGrid} maxWidth="md">
                        <Grid container spacing={4}>
                            {this.renderCharacters(characters)}
                        </Grid>
                    </Container>
                </main>
                <footer className={classes.footer}>
                    <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                        Desafio frontend
                    </Typography>
                    <Copyright />
                </footer>
            </React.Fragment>
        );
    }
}
