---
title: 느려진 zsh 터미널 성능 최적화
publishedAt: 2025-10-03
draft: true
---

개발할 때는 주로 neovim을 사용하다 보니, 터미널에서 모든 작업을 수행하는 데
쉘이 켜지는 속도가 갑자기 너무 느린 게 느껴지는 것이었다.

느린 원인을 찾고 개선하기 위한 여정이다.

## 목차

## 원인 찾기

[zsh-bench](https://github.com/romkatv/zsh-bench)을 돌려보았다.

```sh
# 설치하고 실행
> ~/zsh-bench/zsh-bench
```

![zsh-bench-result](/zsh-performance-update/zsh-bench.png)

눈 여겨볼건 이거다. `first_prompt_lag_ms=1409.696`

처음 키고 프롬프트 입력할수 있을때 까지 `1409ms`가 걸린다.
그러면 이제 `zsh/zprof`를 사용하여 무엇 때문에 느린지 살펴보자

```sh
# .zshrc 에 해당 라인 추가
> zmodload zsh/zprof
```

```sh
# 실행
> zprof
```

![zprof](/zsh-performance-update/zprof.png)

nvm이 많이 느린편인걸 알 수 있다.

## 개선 하기

nvm을 제거하고 하는김에 플러그인 매니저까지 변경하였다.

- nvm 대안책 찾기 => [Volta](https://volta.sh/)
- oh-my-zsh => [antidote](https://github.com/mattmc3/antidote)

본인은 nix[^1]를 사용하기에 아래와 같이 설정을 하였다.

[^1]: nix는 선언적이고 재현 가능한 방식으로 소프트웨어 패키지를 관리할 수 있는 도구입니다. 자세한 내용은 [nix 공식 웹사이트](https://nixos.org/)를 참조하세요.

```nix
# configuration.nix
{
  environment.systemPackages = with pkgs; [
    ...
    antidote
    volta
  ]

  programs.zsh = {
    enable = true;
    enableBashCompletion = false;
    enableCompletion = false;
    variables = {
      ZDOTDIR = "$HOME/.config/zsh";
    };
    promptInit = ''
      fpath=(${pkgs.antidote}/share/antidote/functions $fpath)
      autoload -Uz antidote
    '';
  };
}
```

## 결과

![zsh-bench-result-2](/zsh-performance-update/result2.png)

first_prompt_lag_ms가 `39.118ms`로 줄었다. (97.22% 빨라짐)
`volta` 도 nvm 보다 휠씬 간단하고 빠르다.

아주 쾌적하고 만족스럽다.🙂

## 추가적으로

`omz` 프레임워크를 벗어나니 `sub-string-search` 기능이 빠져있다.
zsh-vi 모드를 사용하기에 해당 기능도 넣어주었다.

```bash
function zvm_before_init() {
    # up, down 시 히스토리 substring search
    autoload -U history-search-end
    zle -N history-beginning-search-backward-end history-search-end
    zle -N history-beginning-search-forward-end history-search-end

    # zsh-vi-mode
    zvm_bindkey viins '^[[A' history-beginning-search-backward-end
    zvm_bindkey viins '^[[B' history-beginning-search-forward-end
    zvm_bindkey vicmd '^[[A' history-beginning-search-backward-end
    zvm_bindkey vicmd '^[[B' history-beginning-search-forward-end
}
```

> 설정은 제[dotfiles](https://github.com/Yanguk/dotfiles)에서 볼 수 있습니다.
